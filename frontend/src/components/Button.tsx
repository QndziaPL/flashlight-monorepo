import { forwardRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import { withBackslash } from "../Router/helpers.ts";
import { Button as BTN, ButtonProps as BTNProps } from "../@/components/ui/button.tsx";

type ButtonProps = {
  children: ReactNode;
  link?: string;
} & BTNProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  if (props.link !== undefined) {
    return (
      <Link to={withBackslash(props.link)}>
        <BTN ref={ref} {...props}>
          {props.children}
        </BTN>
      </Link>
    );
  }

  return (
    <BTN ref={ref} {...props}>
      {props.children}
    </BTN>
  );
});

Button.displayName = "Button";
