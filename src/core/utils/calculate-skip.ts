export const calculateSkip = (pageNumber: number, pageSize: number) => {
  return (pageNumber - 1) * pageSize;
};
