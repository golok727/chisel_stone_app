import React, { HTMLAttributes, ReactNode } from "react";
import "./button_styles.css";
interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}
const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
	return (
		<button className="app__btn-primary" {...props}>
			{children}
		</button>
	);
};

export default Button;
