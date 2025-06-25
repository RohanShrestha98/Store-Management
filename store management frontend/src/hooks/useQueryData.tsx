import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate";
import { useAuthStore } from "@/store/useAuthStore";

export const useQueryData = (
  key: string[],
  path: string,
  params = "",
  enabled = true
) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: [key, params],
    queryFn: () =>
      axiosPrivate({
        url: path,
        method: "get",
        params: params,
      }).then((res) => res?.data && res?.data),
    enabled,
  });
};

export const useUserData = (searchText = "", pageSize = "10", page = 1) =>
  useQueryData(
    ["user", searchText, pageSize, page],
    `api/user/?searchText=${searchText}&pageSize=${pageSize}&page=${page}`
  );

export const useStoreData = (searchText = "", pageSize = "10", page = 1) =>
  useQueryData(["store", searchText, pageSize, page], `api/store/`);

export const useProductData = (searchText = "", pageSize = "10", page = 1) =>
  useQueryData(
    ["product", searchText, pageSize, page],
    `api/product/?searchText=${searchText}&page=${page}&pageSize=${pageSize}`
  );

export const useSalesData = (searchText = "", pageSize = "10", page = 1) =>
  useQueryData(["sales", searchText, pageSize, page], `api/sales/`);

export const useProductForUserData = (
  storeNumber,
  limit,
  change,
  stock = true,
  searchText,
  pageSize = 10,
  page = 1
) => {
  return useQueryData(
    [
      "product-for-user",
      pageSize,
      page,
      change,
      stock,
      storeNumber,
      limit,
      searchText,
    ],
    `api/product/store/${storeNumber ?? 11111}/?limit=${limit}&stock=${stock}`
  );
};

export const useCategoryData = (searchText = "", pageSize = "10", page = 1) =>
  useQueryData(
    ["category", searchText, pageSize, page],
    `api/category/?page=${page}&&searchText=${searchText}&&pageSize=${pageSize}`
  );

export const useCategoryNameData = () =>
  useQueryData(["category-name"], `api/category/name-list/`);

export const useCategoryDetailsData = (id) =>
  useQueryData(
    ["category-details", id],
    `api/category/details/${id}`,
    "",
    !!id
  );

export const useProductDataByBarcode = (
  barCode,
  storeNumber,
  limit,
  searchText,
  page,
  pageSize
) => {
  const { user } = useAuthStore();
  return useQueryData(
    ["product-bar-code", barCode, searchText, page, pageSize, storeNumber],
    `api/product/bar-code/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&barCode=${barCode}&storeNumber=${
      storeNumber ?? user?.data?.storeId
    }&limit=${limit ?? 10}`
  );
};

export const useAddProductByBarcodeData = (
  barCode,
  addProduct = false,
  done,
  storeNumber,
  limit
) => {
  const { user } = useAuthStore();
  return useQueryData(
    ["product-bar-code", barCode, addProduct, storeNumber, done],
    `api/product/bar-code/?barCode=${barCode}&storeNumber=${
      storeNumber ?? user?.data?.storeId
    }&addProduct=${addProduct}&limit=${limit ?? 1}`,
    "",
    !!barCode
  );
};

export const useVendorData = (searchText = "", pageSize = "10", page = 1) =>
  useQueryData(["vendor", searchText, pageSize, page], `api/vendor/`);

export const useNotificationData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1
) =>
  useQueryData(
    ["notification"],
    `api/v1/notification/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}`
  );

export const useRiskData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1
) =>
  useQueryData(
    ["risk", searchText, selectedField, pageSize, page],
    `api/v1/risk/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}`,
    ""
  );

export const useRiskDetailsData = (selectedField = "") =>
  useQueryData(
    ["risk", selectedField],
    `api/v1/risk/details/${selectedField}`,
    ""
  );

export const useReportData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1
) =>
  useQueryData(
    ["report", searchText, selectedField, pageSize, page],
    `api/v1/report/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}`
  );
export const useCourseData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1,
  open = true
) =>
  useQueryData(
    ["course", searchText, selectedField, pageSize, page],
    `api/v3/course/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&courseGroupID=${selectedField}`,
    "",
    open
  );

export const useSubjectData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1,
  open = true
) =>
  useQueryData(
    ["subject", searchText, selectedField, pageSize, page],
    `api/v3/subject/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&courseID=${selectedField}`,
    "",
    open
  );
export const useUnitData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1,
  open = true
) =>
  useQueryData(
    ["unit", searchText, selectedField, pageSize, page],
    `api/v3/unit/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&subjectID=${selectedField}`,
    "",
    open
  );
export const useQuestionBankData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1,
  open = true
) =>
  useQueryData(
    ["question-set", searchText, selectedField, pageSize, page],
    `api/v3/question-set/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&courseID=${selectedField}`,
    "",
    open
  );
export const useQuestionData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1
) =>
  useQueryData(
    ["question", searchText, selectedField, pageSize, page],
    `api/v3/question/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&subjectID=${selectedField}`
  );
export const useQuestionSetDetailsData = (questionSetID) =>
  useQueryData(
    ["question-set-details", questionSetID],
    `/api/v3/question-set/details/${questionSetID}`
  );
export const useReferalCodeData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1
) =>
  useQueryData(
    ["referal", searchText, selectedField, pageSize, page],
    `api/v3/referral/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&courseID=${selectedField}`
  );
export const usePaymentData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1
) =>
  useQueryData(
    ["payment", searchText, selectedField, pageSize, page],
    `api/v3/payment/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&courseID=${selectedField}`
  );
export const useFeedbackData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1
) =>
  useQueryData(
    ["feedback", searchText, selectedField, pageSize, page],
    `api/v3/feedback/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&courseID=${selectedField}`
  );
export const useStudentData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1
) =>
  useQueryData(
    ["student", searchText, selectedField, pageSize, page],
    `api/v3/student/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&courseID=${selectedField}`
  );
export const useCourseGroupData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1,
  open = true
) =>
  useQueryData(
    ["course-group", searchText, selectedField, pageSize, page],
    `api/v3/course-group/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&courseID=${selectedField}`,
    "",
    open
  );
export const useChapterData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1
) =>
  useQueryData(
    ["chapter", searchText, selectedField, pageSize, page],
    `api/v3/chapter/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&unitID=${selectedField}`
  );
export const useContentData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1
) =>
  useQueryData(
    ["content", searchText, selectedField, pageSize, page],
    `api/v3/content/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&chapterID=${selectedField}`
  );
export const useQuizData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1,
  open = true
) =>
  useQueryData(
    ["test", searchText, selectedField, pageSize, page],
    `api/v3/test/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&courseID=${selectedField}`,
    "",
    open
  );
export const useViewQuizData = (testId = "") =>
  useQueryData(["viewTest", testId], `/api/v3/test/details/${testId}`);

export const useLiveGroupData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1,
  open = true
) =>
  useQueryData(
    ["live-group", searchText, selectedField, pageSize, page],
    `api/v3/live-group/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&courseID=${selectedField}`,
    "",
    open
  );
export const useLiveData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1,
  open = true
) =>
  useQueryData(
    ["live", searchText, selectedField, pageSize, page],
    `api/v3/live/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&liveGroupID=${selectedField}`,
    "",
    open
  );
export const usePackageData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = 1,
  selectedCourseId
) =>
  useQueryData(
    ["package", searchText, selectedField, pageSize, page, selectedCourseId],
    `api/v3/package/list/?page=${page}&&search=${searchText}&&pageSize=${pageSize}&&courseID=${selectedField}`
  );
export const useLeaderBoardQuizData = (testID) =>
  useQueryData(
    ["leaderboard", testID],
    `api/v3/test/leaderboard/${testID}/`,
    "",
    !!testID
  );
export const useTestTypeData = (
  pageSize = "10",
  selectedField = "",
  page = "1",
  open = true
) =>
  useQueryData(
    ["test-type", page, pageSize, selectedField],
    `api/v3/test-type/list/?page=${page}&&pageSize=${pageSize}&&courseID=${selectedField}`,
    "",
    open
  );
export const useTestSeriesData = (
  searchText = "",
  selectedField = "",
  pageSize = "10",
  page = "1",
  open = true
) =>
  useQueryData(
    ["test-series", searchText, selectedField, page, pageSize],
    `api/v3/test-series/list/?page=${page}&&pageSize=${pageSize}&&search=${searchText}&&courseID=${selectedField}`,
    "",
    open
  );
export const usePackageTypeData = (pageSize = "10", page = "1", open = true) =>
  useQueryData(
    ["package-type", page, pageSize],
    `api/v3/package-type/list/?page=${page}&&pageSize=${pageSize}`,
    "",
    open
  );
export const useFileUrlData = (pageSize = "10", page = "1") =>
  useQueryData(
    ["file-url", page, pageSize],
    `api/v3/file-client/list/?page=${page}&&pageSize=${pageSize}`
  );
