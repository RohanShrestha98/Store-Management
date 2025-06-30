export const defaultSelect = (lists, value, name = false) => {
  const filterList = lists?.filter((item) =>
    name ? item?.name : item?.id == value
  )?.[0];
  const defaultValue = {
    value: name ? filterList?.name : filterList?.id,
    label: filterList?.name,
  };
  return defaultValue;
};
