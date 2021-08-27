import React from 'react'

import { Icon } from './Icon'

export const PinIcon = React.memo(({ className }: { className?: string }) => (
  <Icon size="16" viewBox="0 0 16 16" fill="none" color="currentColor" className={className}>
    <path
      d="M10 7.7227V3.9987H11.3333V2.66536C11.3333 2.31174 11.1929 1.9726 10.9428 1.72256C10.6928 1.47251 10.3536 1.33203 10 1.33203H6C5.64638 1.33203 5.30724 1.47251 5.05719 1.72256C4.80714 1.9726 4.66667 2.31174 4.66667 2.66536V3.9987H6V7.7227L4.19533 8.8607C4.13331 8.9225 4.08411 8.99596 4.05059 9.07685C4.01707 9.15775 3.99987 9.24447 4 9.33203V10.6654C4 10.8422 4.07024 11.0117 4.19526 11.1368C4.32029 11.2618 4.48986 11.332 4.66667 11.332H7.33333V13.332L8 14.6654L8.66667 13.332V11.332H11.3333C11.5101 11.332 11.6797 11.2618 11.8047 11.1368C11.9298 11.0117 12 10.8422 12 10.6654V9.33203C12.0001 9.24447 11.9829 9.15775 11.9494 9.07685C11.9159 8.99596 11.8667 8.9225 11.8047 8.8607L10 7.7227Z"
      fill="currentColor"
    />
  </Icon>
))
