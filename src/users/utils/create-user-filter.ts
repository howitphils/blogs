export const createUserFilter = (
  searchLoginTerm: string | null,
  searchEmailTerm: string | null,
) => {
  let filter = {};

  if (searchLoginTerm && searchEmailTerm) {
    filter = {
      $or: [
        { login: { $regex: searchLoginTerm, $options: "i" } },
        { email: { $regex: searchEmailTerm, $options: "i" } },
      ],
    };
  } else if (searchLoginTerm) {
    filter = { login: { $regex: searchLoginTerm, $options: "i" } };
  } else if (searchEmailTerm) {
    filter = { email: { $regex: searchEmailTerm, $options: "i" } };
  }

  return filter;
};
