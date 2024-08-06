import { IApiResponse } from "../common/interface";

/**
 * Function responsible to map response status code & message.
 * @param error Error Object
 * @param {IApiResponse} response
 */
export const errorResponseMap = (error: any, response: IApiResponse) => {
  if (error?.response?.data) {
    const { message, code } = error.response.data;
    if (message) {
      response.message = message;
    }
    if (code) {
      response.message = code;
    }
  }
};
