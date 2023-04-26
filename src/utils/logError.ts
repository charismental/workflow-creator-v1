export default (error: Error, info: { componentStack: string }) => {
  console.error("LogError console statement - Error: ", error);
  console.error("LogError console statement - Error Stack: ", info);
};
