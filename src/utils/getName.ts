export const getFirstName = (fullName: string | undefined | null) => {
  if (!fullName) return '';

  const userFirstName = fullName?.includes(' ')
    ? fullName.slice(0, fullName.indexOf(' '))
    : fullName;

  return userFirstName
};