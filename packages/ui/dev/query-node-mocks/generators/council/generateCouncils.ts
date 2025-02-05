import faker from 'faker'

import { Reducer } from '@/common/types/helpers'
import {
  RawCouncilCandidateMock,
  RawCouncilElectionMock,
  RawCouncilMock,
  RawCouncilorMock,
  RawCouncilVoteMock,
} from '@/mocks/data/seedCouncils'

import { saveFile } from '../../helpers/saveFile'
import { memberAt, randomFromRange, randomFromWeightedSet, randomMember, repeat } from '../utils'

const COUNCILS = 5

export const generateCouncils = () => {
  const data = Array.from({ length: COUNCILS }).reduce(generateCouncil, {
    councils: [],
    councilors: [],
    electionRounds: [],
    candidates: [],
    votes: [],
  })
  Object.entries(data).forEach(([fileName, contents]) => saveFile(fileName, contents))
}

interface CouncilData {
  councils: RawCouncilMock[]
  councilors: RawCouncilorMock[]
  electionRounds: RawCouncilElectionMock[]
  candidates: RawCouncilCandidateMock[]
  votes: RawCouncilVoteMock[]
}

const generateCouncil: Reducer<CouncilData, any> = (data, _, councilIndex) => {
  const isFinished = councilIndex !== COUNCILS - 1
  const hasEnded = councilIndex < COUNCILS - 2

  const council = {
    id: String(councilIndex),
    electedAtBlock: randomFromRange(10000, 1000000),
    endedAtBlock: hasEnded ? randomFromRange(10000, 1000000) : null,
  }

  const councilors: RawCouncilorMock[] = repeat(
    (councilorIndex) => ({
      id: `${council.id}-${councilorIndex}`,
      electedInCouncilId: council.id,
      memberId: randomMember().id,
      unpaidReward: Math.random() < 0.5 ? 0 : randomFromRange(1000, 100000),
      stake: randomFromRange(10000, 1000000),
    }),
    isFinished ? randomFromRange(5, 8) : 0
  )

  function createCandidate(candidateIndex: number, member: ReturnType<typeof randomMember>) {
    return {
      id: `${council.id}-${candidateIndex}`,
      memberId: isFinished ? councilors[candidateIndex].memberId : member.id,
      electionRoundId: council.id,
      stake: isFinished ? councilors[candidateIndex].stake : randomFromRange(10000, 1000000),
      stakingAccountId: member.controllerAccount,
      rewardAccountId: member.rootAccount,
      note: faker.lorem.words(10),
      noteMetadata: {
        header: faker.lorem.words(4),
        bulletPoints: Array.from({ length: 3 }).map(() => faker.lorem.words(8)),
        bannerImageUri: 'https://picsum.photos/500/300',
        description: faker.lorem.words(10),
      },
    }
  }

  const candidates: RawCouncilCandidateMock[] = repeat(
    (candidateIndex) => createCandidate(candidateIndex, randomMember()),
    isFinished ? councilors.length : randomFromRange(5, 8)
  )

  if (!isFinished) {
    candidates.push(createCandidate(candidates.length - 1, memberAt(0)))
  }

  const electionRound: RawCouncilElectionMock = {
    id: council.id,
    cycleId: Number(council.id),
    isFinished,
    electedCouncilId: council.id,
  }

  const getCastBy = randomFromWeightedSet(
    [1, '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY'],
    [1, '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc'],
    [5, '5ChwAW7ASAaewhQPNK334vSHNUrPFYg2WriY2vDBfEQwkipU']
  )

  const votes: RawCouncilVoteMock[] = repeat(
    () => ({
      electionRoundId: council.id,
      stake: randomFromRange(1, 10) * 1000,
      stakeLocked: isFinished ? Math.random() > 0.5 : true,
      castBy: getCastBy(),
      voteForId: Math.random() > 0.5 ? candidates[randomFromRange(0, candidates.length - 1)].memberId : null,
    }),
    randomFromRange(10, 20)
  )

  return {
    councils: [...data.councils, council],
    councilors: [...data.councilors, ...councilors],
    electionRounds: [...data.electionRounds, electionRound],
    candidates: [...data.candidates, ...candidates],
    votes: [...data.votes, ...votes],
  }
}

export const councilModule = {
  command: 'council',
  describe: 'Generate council from other mocks',
  handler: generateCouncils,
}
