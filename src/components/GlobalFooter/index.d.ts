import * as React from "react";
export interface IglobalFooterProps {
  links?: Array<{
    title: React.ReactNode;
    href: string;
    blankTarget?: boolean;
  }>;
  copyright?: React.ReactNode;
  style?: React.CSSProperties;
}

export default class GlobalFooter extends React.Component<
  IglobalFooterProps,
  any
> {}
