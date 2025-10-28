
class APIFeatures{

constructor(query , querystring ){
this.query = query;
this.querystring = querystring;
}

filter(){
let queryString = JSON.stringify(this.querystring );
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    const finalQuery = JSON.parse(queryString);
    this.query = this.query.find(finalQuery);
    return this;
}
sort(){
if (this.querystring.sort)
      this.query = this.query.sort(this.querystring.sort)
    else
       this.query =  this.query.sort("createdAt")
 return this;
}
select(){
if (this.querystring.select)
      this.query = this.query.select(this.querystring.select)
    else
       this.query =  this.query.select("-__v")
   return this;
}
pagination(){
  if(this.querystring.page ){
    const limit = this.querystring.limit * 1;
      const page = this.querystring.page * 1;
      const skip = (page - 1) * limit;
      //  const doucnum =  await a.countDocuments();
      // const aa = skip + limit;
      this.query = this.query.skip(skip).limit(limit);
}
   return this;
}

}

module.exports = APIFeatures;
