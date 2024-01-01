import {testsUrl} from "../../config/urls";
import {backend} from "../../config";

export const getAllTestsResults = async () => (
    backend.get(testsUrl.GET_ALL_TESTS_RESULTS)
)