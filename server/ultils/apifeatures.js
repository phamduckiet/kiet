class ApiFeatures {
    constructor(query, queryStr){
        // query là mảng ProductModel.find()
        // queryStr là chuỗi query params
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
    // search all product theo query nếu như có query params, còn không lấy all product
    // $regex : dùng để tìm kiếm, $option : $i là không phân biệt kiểu chữ lower,upper
        const keyword = this.queryStr.keyword ? {
            name : {
                $regex : this.queryStr.keyword,
                $options : "$i"
            }
        } : {};
        
        this.query = this.query.find({...keyword});
        return this;
    };

    filter(){
        const queryFilter = {...this.queryStr};
        
        const removeFields = ["keyword", "page", "limit"];
        // xóa key : keyword, page, limit của object queryFilter;
        // toán tử delete cho phép xóa thuộc tính khỏi đối tượng
        removeFields.map((key)=> delete queryFilter[key]);

        // filter price [gt, lt] and Rating nếu có;
        // nếu mà có gt, gte, lt, lte thì parse $gt, $gte, $lt, $lte
        let queryStr = JSON.stringify(queryFilter);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);
        
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    };

    pagination(perPage){
        // perPage là số sản phẩm trên 1 trang
        const currentPage = Number(this.queryStr.page) || 1 ;
        const skip = perPage * ( currentPage - 1 );
        this.query = this.query.limit(perPage).skip(skip);
        return this;
    };
};

export default ApiFeatures;