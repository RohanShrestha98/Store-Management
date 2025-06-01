export const convertToSelectOptions = (lists) => {
  const options =
    lists ??
    []?.map((item) => {
      return {
        value: item?.id,
        label: item?.title ?? item?.Title ?? item?.topic,
      };
    });
  return options;
};
