import { AnimateSharedLayout } from 'framer-motion'
import React, { useState } from 'react'
import { generatePath } from 'react-router-dom'
import styled from 'styled-components'

import { MembersRoutes, ProfileRoutes, SettingsRoutes } from '@/app/constants/routes'
import { Notifications, NotificationsButton } from '@/common/components/Notifications'
import { ConstitutionIcon } from '@/common/components/page/Sidebar/LinksIcons/ConstitutionIcon'
import { CouncilIcon } from '@/common/components/page/Sidebar/LinksIcons/CouncilIcon'
import { FinancialsIcon } from '@/common/components/page/Sidebar/LinksIcons/FinancialsIcon'
import { ForumIcon } from '@/common/components/page/Sidebar/LinksIcons/ForumIcon'
import { MembersIcon } from '@/common/components/page/Sidebar/LinksIcons/MembersIcon'
import { MyProfileIcon } from '@/common/components/page/Sidebar/LinksIcons/MyProfileIcon'
import { OverviewIcon } from '@/common/components/page/Sidebar/LinksIcons/OverviewIcon'
import { ProposalsIcon } from '@/common/components/page/Sidebar/LinksIcons/ProposalsIcon'
import { SettingsIcon } from '@/common/components/page/Sidebar/LinksIcons/SettingsIcon'
import { ValidatorsIcon } from '@/common/components/page/Sidebar/LinksIcons/ValidatorsIcon'
import { WorkingGroupsIcon } from '@/common/components/page/Sidebar/LinksIcons/WorkingGroupsIcon'
import { LogoLink } from '@/common/components/page/Sidebar/LogoLink'
import { Navigation, NavigationInnerWrapper } from '@/common/components/page/Sidebar/Navigation'
import { NavigationHeader } from '@/common/components/page/Sidebar/NavigationHeader'
import { NavigationLink } from '@/common/components/page/Sidebar/NavigationLink'
import { RemoveScrollbar } from '@/common/constants'
import { CouncilRoutes } from '@/council/constants'
import { ForumRoutes } from '@/forum/constant'
import { ProfileComponent } from '@/memberships/components/ProfileComponent'
import { ProposalsRoutes } from '@/proposals/constants/routes'
import { WorkingGroupsRoutes } from '@/working-groups/constants'

export const SideBar = () => {
  const [isNotificationsPanelOpen, setNotificationsPanelOpen] = useState(false)
  const onClose = () => setNotificationsPanelOpen(false)

  return (
    <Navigation>
      <NavigationInnerWrapper>
        <NavigationHeader>
          <LogoLink />
          <NotificationsButton
            onClick={() => setNotificationsPanelOpen(!isNotificationsPanelOpen)}
            isNotificationsPanelOpen={isNotificationsPanelOpen}
          />
        </NavigationHeader>
        <AnimateSharedLayout>
          <NavigationLinks>
            <NavigationLinksItem>
              <NavigationLink to="/inexisting" disabled>
                <OverviewIcon />
                Overview
              </NavigationLink>
            </NavigationLinksItem>
            <NavigationLinksItem>
              <NavigationLink to={ProfileRoutes.profile}>
                <MyProfileIcon />
                My profile
              </NavigationLink>
            </NavigationLinksItem>
            <NavigationLinksItem>
              <NavigationLink to={WorkingGroupsRoutes.groups}>
                <WorkingGroupsIcon />
                Working Groups
              </NavigationLink>
            </NavigationLinksItem>
            <NavigationLinksItem>
              <NavigationLink to={ProposalsRoutes.current}>
                <ProposalsIcon />
                Proposals
              </NavigationLink>
            </NavigationLinksItem>
            <NavigationLinksItem>
              <NavigationLink to={CouncilRoutes.council}>
                <CouncilIcon />
                Council
              </NavigationLink>
            </NavigationLinksItem>
            <NavigationLinksItem>
              <NavigationLink to="/inexisting" disabled>
                <ConstitutionIcon />
                Constitution
              </NavigationLink>
            </NavigationLinksItem>
            <NavigationLinksItem>
              <NavigationLink to="/inexisting" disabled>
                <ValidatorsIcon />
                Validators
              </NavigationLink>
            </NavigationLinksItem>
            <NavigationLinksItem>
              <NavigationLink to={ForumRoutes.forum}>
                <ForumIcon />
                Forum
              </NavigationLink>
            </NavigationLinksItem>
            <NavigationLinksItem>
              <NavigationLink to={generatePath(MembersRoutes.members)}>
                <MembersIcon />
                Members
              </NavigationLink>
            </NavigationLinksItem>
            <NavigationLinksItem>
              <NavigationLink to="/inexisting" disabled>
                <FinancialsIcon />
                Financials
              </NavigationLink>
            </NavigationLinksItem>
            <NavigationLinksItem>
              <NavigationLink to={SettingsRoutes.settings}>
                <SettingsIcon />
                Settings
              </NavigationLink>
            </NavigationLinksItem>
          </NavigationLinks>
        </AnimateSharedLayout>
        <ProfileComponent />
      </NavigationInnerWrapper>
      <Notifications onClose={onClose} isNotificationsPanelOpen={isNotificationsPanelOpen} />
    </Navigation>
  )
}

const NavigationLinks = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  grid-area: barlinks;
  list-style: none;
  max-height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  mask-image: linear-gradient(0deg, transparent 0px, black 8px, black calc(100% - 8px), transparent 100%);
  ${RemoveScrollbar};
`

const NavigationLinksItem = styled.li`
  display: flex;
  height: fit-content;
  width: 100%;
`
