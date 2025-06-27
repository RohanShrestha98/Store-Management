import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate";
import { useAuthStore } from "@/store/useAuthStore";

export const useMutate = (
  queryKey: string[],
  basePath: string,
  contentType = "application/json"
) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const mutation = useMutation({
    mutationFn: async (params: string[]) => {
      const requestData = {
        method: params?.[0],
        url: basePath + params?.[1],
        data: params?.[2],
        headers: {
          "Content-Type": contentType,
        },
      };
      const response = await axiosPrivate(requestData);
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey]);
    },
    onError: (err) => {
      return err?.response?.data;
    },
  });
  return mutation;
};

export const useAuthMutation = () => useMutate(["login"], "api/user/login");

export const useClockInMutation = () =>
  useMutate(["clock-in"], "/api/clock-in");

export const useAuthSignupMutation = () =>
  useMutate(["signup"], "api/user/sign-up");

export const useAuthAdminMutation = () =>
  useMutate(["admin"], "api/admin/create");

export const useCategoryMutation = () =>
  useMutate(["category"], "api/category/");

export const useProductMutation = () =>
  useMutate(["product"], "api/product/", "multipart/form-data");

export const useUserMutation = () => useMutate(["user"], "api/user/");

export const useStoreMutation = () => useMutate(["store"], "api/store/");

export const useVendorMutation = () => useMutate(["vendor"], "api/vendor/");

export const useUploadMutation = () => useMutate(["upload"], "api/upload/");

export const useSalesMutation = () => {
  return useMutate(["sales"], `api/sales`);
};

export const useChangePasswordMutation = () =>
  useMutate(
    ["change_password"],
    "api/v1/change_password/",
    "multipart/form-data"
  );

export const useNotificationMutation = () =>
  useMutate(["notification"], "api/v1/notification/", "multipart/form-data");

export const useRiskMutation = () =>
  useMutate(["risk"], "api/v1/risk/", "multipart/form-data");

export const useCourseMutation = () =>
  useMutate(["course"], "api/v3/course/", "multipart/form-data");

export const useSubjectMutation = () =>
  useMutate(["subject"], "api/v3/subject/", "multipart/form-data");

export const useUnitMutation = () =>
  useMutate(["unit"], "api/v3/unit/", "multipart/form-data");

export const useQuestionBankMutation = () =>
  useMutate(["question-set"], "api/v3/question-set/", "multipart/form-data");

export const useQuestionMutation = () =>
  useMutate(["question"], "api/v3/question/", "multipart/form-data");

export const useAddQuestionMutation = () =>
  useMutate(["question"], "api/v3/question/create/", "multipart/form-data");

export const useReferalCodeMutation = () =>
  useMutate(["referal"], "api/v3/referral/", "multipart/form-data");

export const useChapterMutation = () =>
  useMutate(["chapter"], "api/v3/chapter/", "multipart/form-data");

export const useContentMutation = () =>
  useMutate(["content"], "api/v3/content/", "multipart/form-data");

export const useQuizMutation = () =>
  useMutate(["test"], "api/v3/test/", "multipart/form-data");

export const useTestTypeMutation = () =>
  useMutate(["test-type"], "api/v3/test-type/", "multipart/form-data");

export const useTestSeriesMutation = () =>
  useMutate(["test-series"], "api/v3/test-series/", "multipart/form-data");

export const useLiveGroupMutation = () =>
  useMutate(["live-group"], "api/v3/live-group/", "multipart/form-data");

export const useLiveMutation = () => useMutate(["live"], "api/v3/live/");

export const usePackageMutation = () =>
  useMutate(["package"], "api/v3/package/", "multipart/form-data");

export const useAssignQuestionMutation = () =>
  useMutate(["assign-question"], "api/v3/question-set/assign-questions/");

export const usePublishNotificationMutation = () =>
  useMutate(["publish-notification"], "api/v3/notification/publish/");

export const useManualPaymentMutation = () =>
  useMutate(["add-manual-payment"], "api/v3/payment/add-manual-payment/");

export const useChapterPositionUpdateMutation = () =>
  useMutate(["chapter-update-position"], "api/v3/chapter/update-position/");

export const useUnitPositionUpdateMutation = () =>
  useMutate(["unit-update-position"], "api/v3/unit/update-position/");

export const useTestUpdateStatusMutation = () =>
  useMutate(["test"], "api/v3/test/update-status/");

export const useCourseUpdateStatusMutation = () =>
  useMutate(["course"], "api/v3/course/update-availability/");
