import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function SelectInput(
    {
        options = [],
        children = null,
        className = "",
        isFocused = false,
        ...props
    },
    ref
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <select
            {...props}
            className={
                "rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 " +
                className
            }
            ref={localRef}
        >
            {children ??
                options.map((opt) =>
                    typeof opt === "object" ? (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ) : (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    )
                )}
        </select>
    );
});
