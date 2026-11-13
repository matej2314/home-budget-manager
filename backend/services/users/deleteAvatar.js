export async function deleteAvatar(userName) {
  return {
    messageKey: `User's  ${userName} avatar removed correctly.`,
  };
}
