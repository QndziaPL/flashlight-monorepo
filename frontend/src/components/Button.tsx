import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { withBackslash } from "../Router/helpers.ts";
import { Button as BTN, ButtonProps as BTNProps } from "../@/components/ui/button.tsx";

// type SpecificButtonTypeProps = ActionButtonProps | LinkButtonProps;

type ButtonProps = {
  children: ReactNode;
  link?: string;
} & BTNProps;
// SpecificButtonTypeProps;
export const Button: FC<ButtonProps> = (props) => {
  if (props.link !== undefined) {
    return (
      <Link to={withBackslash(props.link)}>
        <BTN {...props}>{props.children}</BTN>
      </Link>
    );
  }

  return <BTN {...props}>{props.children}</BTN>;
  // switch (props.link) {
  //   case "link":
  //
  //   case "action":
  //     return <BTN {...props}>{props.children}</BTN>;
  // }
};
