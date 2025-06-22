export const convertToSelectOptions = (lists, name = false) => {
  const options = lists?.map((item) => {
    return {
      value: name ? item?.name : item?.storeNumber ?? item?.id,
      label: item?.name,
    };
  });
  return options;
};
