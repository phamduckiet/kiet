// bắt các lỗi về bất đồng bộ
export const catchAsyncModels = (func) => (req, res, next) =>{
    Promise.resolve(func(req, res, next)).catch(next);
}