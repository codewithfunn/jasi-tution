export const formatPrice = (price:number)=>{
    return new Intl.NumberFormat("en-Us",{
        style:"currency",
        currency:"INR",
    }).format(price)
}