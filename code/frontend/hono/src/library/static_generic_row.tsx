export const StaticGenericRow = ({
  width,
  height,
  children
}: {
  width?: string,
  height?: string,
  children?: React.ReactNode
}): React.JSX.Element => {
  return (
    <div style={{
      width: width,
      height: height,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    }}>
      {children}
    </div>
  );
}