export default (error: Error, info: { componentStack: string }) => {
  console.error("Error: ", error);
  console.error("Error Stack: ", info);
};
