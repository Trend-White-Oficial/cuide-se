import * as React from "react";
<<<<<<< HEAD
declare const InputOTP: React.ForwardRefExoticComponent<(Omit<Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "textAlign" | "maxLength" | "onChange" | "onComplete" | "pushPasswordManagerStrategy" | "pasteTransformer" | "containerClassName" | "noScriptCSSFallback"> & {
=======
declare const InputOTP: React.ForwardRefExoticComponent<(Omit<Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "textAlign" | "onChange" | "maxLength" | "onComplete" | "pushPasswordManagerStrategy" | "pasteTransformer" | "containerClassName" | "noScriptCSSFallback"> & {
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
    value?: string;
    onChange?: (newValue: string) => unknown;
    maxLength: number;
    textAlign?: "left" | "center" | "right";
    onComplete?: (...args: any[]) => unknown;
    pushPasswordManagerStrategy?: "increase-width" | "none";
    pasteTransformer?: (pasted: string) => string;
    containerClassName?: string;
    noScriptCSSFallback?: string | null;
} & {
    render: (props: import("input-otp").RenderProps) => React.ReactNode;
    children?: never;
<<<<<<< HEAD
} & React.RefAttributes<HTMLInputElement>, "ref"> | Omit<Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "textAlign" | "maxLength" | "onChange" | "onComplete" | "pushPasswordManagerStrategy" | "pasteTransformer" | "containerClassName" | "noScriptCSSFallback"> & {
=======
} & React.RefAttributes<HTMLInputElement>, "ref"> | Omit<Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "textAlign" | "onChange" | "maxLength" | "onComplete" | "pushPasswordManagerStrategy" | "pasteTransformer" | "containerClassName" | "noScriptCSSFallback"> & {
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
    value?: string;
    onChange?: (newValue: string) => unknown;
    maxLength: number;
    textAlign?: "left" | "center" | "right";
    onComplete?: (...args: any[]) => unknown;
    pushPasswordManagerStrategy?: "increase-width" | "none";
    pasteTransformer?: (pasted: string) => string;
    containerClassName?: string;
    noScriptCSSFallback?: string | null;
} & {
    render?: never;
    children: React.ReactNode;
} & React.RefAttributes<HTMLInputElement>, "ref">) & React.RefAttributes<HTMLInputElement>>;
declare const InputOTPGroup: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const InputOTPSlot: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & {
    index: number;
} & React.RefAttributes<HTMLDivElement>>;
declare const InputOTPSeparator: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
