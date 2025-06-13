export const convertToSelectOptions = (lists) => {
  const options = lists?.map((item) => {
    return {
      value: item?.id,
      label: item?.name,
    };
  });
  return options;
};
