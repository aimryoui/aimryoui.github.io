// oxlint-disable tailwindcss/enforces-shorthand

function Layer({ ...props }: React.ComponentProps<"div">) {
    return (
        <div
            tw="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full"
            {...props}
        />
    )
}

function Plus({
    tw,
    style
}: {
    tw?: string
    style?: React.ComponentProps<"div">["style"]
}) {
    return (
        <div
            tw={tw}
            style={{
                ...style,

                width: "var(--stroke-width)",
                height: "var(--stroke-width)",

                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    "--size": "6px",
                    width: "48px",
                    height: "48px",

                    position: "absolute"
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        width: "var(--size)",
                        height: "100%",
                        backgroundColor: "var(--highlighted)",
                        borderRadius: "9999px"
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        height: "var(--size)",
                        width: "100%",
                        backgroundColor: "var(--highlighted)",
                        borderRadius: "9999px"
                    }}
                />
            </div>
        </div>
    )
}

function Line({
    tw,
    style,
    orientation = "horizontal"
}: {
    tw?: string
    style?: React.ComponentProps<"div">["style"]
    orientation?: "vertical" | "horizontal"
}) {
    return (
        <div
            tw={tw}
            style={{
                ...style,
                ...(orientation === "horizontal"
                    ? {
                          borderBottomWidth: "2px",
                          borderBottomStyle: "dashed",
                          borderBottomColor: "var(--stroke)"
                      }
                    : {
                          borderLeftWidth: "2px",
                          borderLeftStyle: "dashed",
                          borderLeftColor: "var(--stroke)"
                      }),
                backgroundColor: "var(--background)"
            }}
        />
    )
}

export { Layer, Line, Plus }
