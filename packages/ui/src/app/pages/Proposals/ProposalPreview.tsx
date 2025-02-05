import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { PageHeaderRow, PageHeaderWrapper, PageLayout } from '@/app/components/PageLayout'
import { BadgesRow, BadgeStatus } from '@/common/components/BadgeStatus'
import { CopyButtonTemplate } from '@/common/components/buttons'
import { ButtonsGroup } from '@/common/components/buttons/Buttons'
import { LinkIcon } from '@/common/components/icons/LinkIcon'
import { Loading } from '@/common/components/Loading'
import { ContentWithSidePanel, ContentWithTabs, MainPanel, RowGapBlock } from '@/common/components/page/PageContent'
import { PageTitle } from '@/common/components/page/PageTitle'
import { PreviousPage } from '@/common/components/page/PreviousPage'
import { SidePanel } from '@/common/components/page/SidePanel'
import { Label, TextInlineMedium, TextMedium } from '@/common/components/typography'
import { camelCaseToText } from '@/common/helpers'
import { useModal } from '@/common/hooks/useModal'
import { formatBlocksToDuration, formatTokenValue } from '@/common/model/formatters'
import { getUrl } from '@/common/utils/getUrl'
import { MemberInfo } from '@/memberships/components'
import { ProposalDiscussions } from '@/proposals/components/ProposalDiscussions'
import { ProposalHistory } from '@/proposals/components/ProposalHistory'
import { ProposalDetailsComponent } from '@/proposals/components/ProposalPreview/ProposalDetails'
import { ProposalStages } from '@/proposals/components/ProposalStages'
import { RationalePreview } from '@/proposals/components/RationalePreview'
import { ProposalStatistics } from '@/proposals/components/StatisticsPreview'
import { VotesPreview } from '@/proposals/components/VotesPreview'
import { ProposalsRoutes } from '@/proposals/constants/routes'
import { useBlocksToProposalExecution } from '@/proposals/hooks/useBlocksToProposalExecution'
import { useProposal } from '@/proposals/hooks/useProposal'
import { useProposalConstants } from '@/proposals/hooks/useProposalConstants'
import { useVotingRounds } from '@/proposals/hooks/useVotingRounds'
import { VoteRationaleModalCall } from '@/proposals/modals/VoteRationale/types'
import { proposalPastStatuses } from '@/proposals/model/proposalStatus'

export const ProposalPreview = () => {
  const { id } = useParams<{ id: string }>()
  const { isLoading, proposal } = useProposal(id)
  const constants = useProposalConstants(proposal?.details.type)
  const loc = useLocation()
  const voteId = new URLSearchParams(loc.search).get('showVote')

  const blocksToProposalExecution = useBlocksToProposalExecution(proposal, constants)

  const votingRounds = useVotingRounds(proposal?.votes, proposal?.proposalStatusUpdates)
  const [currentVotingRound, setVotingRound] = useState(0)
  const votes = votingRounds[currentVotingRound] ?? votingRounds[0]

  useEffect(() => setVotingRound(Math.max(0, votingRounds.length - 1)), [votingRounds.length])

  const { showModal } = useModal()

  useEffect(() => {
    if (voteId) {
      showModal<VoteRationaleModalCall>({ modal: 'VoteRationaleModal', data: { id: voteId } })
    }
  }, [voteId])

  if (isLoading || !proposal || !votes) {
    return (
      <PageLayout
        lastBreadcrumb={id}
        main={
          <RowGapBlock gap={24}>
            <ContentWithSidePanel>
              <Loading />
            </ContentWithSidePanel>
          </RowGapBlock>
        }
      />
    )
  }

  return (
    <PageLayout
      lastBreadcrumb={proposal.title}
      header={
        <PageHeaderWrapper>
          <PageHeaderRow>
            <PreviousPage>
              <PageTitle>{proposal.title}</PageTitle>
            </PreviousPage>
            <ButtonsGroup>
              <CopyButtonTemplate
                size="medium"
                textToCopy={getUrl({ route: ProposalsRoutes.preview, params: { id: proposal.id } })}
                icon={<LinkIcon />}
              >
                Copy link
              </CopyButtonTemplate>
            </ButtonsGroup>
          </PageHeaderRow>

          <RowGapBlock gap={24}>
            <BadgeAndTime>
              <BadgeStatus
                ended={proposalPastStatuses.includes(proposal.status)}
                succeeded={proposal.status === 'executed'}
                inverted
                size="l"
              >
                {camelCaseToText(proposal.status)}
              </BadgeStatus>
              {blocksToProposalExecution && (
                <TextMedium>
                  <TextInlineMedium lighter>Time left:</TextInlineMedium>{' '}
                  <TextInlineMedium bold>{formatBlocksToDuration(blocksToProposalExecution)}</TextInlineMedium>{' '}
                  <TextInlineMedium lighter>({formatTokenValue(blocksToProposalExecution)} blocks)</TextInlineMedium>
                </TextMedium>
              )}
            </BadgeAndTime>
          </RowGapBlock>

          {(proposal.status === 'dormant' || votingRounds.length > 1) && (
            <ProposalStages
              status={proposal.status}
              updates={proposal.proposalStatusUpdates}
              constitutionality={constants?.constitutionality}
              value={currentVotingRound}
              onChange={setVotingRound}
            />
          )}
        </PageHeaderWrapper>
      }
      main={
        <MainPanel>
          <RowGapBlock gap={24}>
            <ProposalStatistics voteCount={votes.count} constants={constants} />

            {/* Proposal-specific dashboard */}
            <h3>{camelCaseToText(proposal.type)}</h3>

            <ProposalDetailsComponent details={proposal.details} />

            <RationalePreview rationale={proposal.rationale} />

            <ProposalDiscussions thread={proposal.discussionThread} proposalId={id} />
          </RowGapBlock>
        </MainPanel>
      }
      sidebar={
        <SidePanel>
          <RowGapBlock gap={36}>
            <VotesPreview votes={votes} />

            <ProposalHistory proposal={proposal} />

            <ContentWithTabs>
              <Label>Proposer</Label>
              <MemberInfo member={proposal.proposer} />
            </ContentWithTabs>
          </RowGapBlock>
        </SidePanel>
      }
    />
  )
}
const BadgeAndTime = styled(BadgesRow)`
  gap: 16px;
`
