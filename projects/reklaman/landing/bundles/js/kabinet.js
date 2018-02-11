

$(function(){$(document).on("click","#add-balance-btn",function(n){n.preventDefault();PaymentLayer()});$(document).on("click","#sendRequestPayment",function(n){n.stopPropagation();console.log("send");var t=$("#paymentRequestForm").find("form");t.valid()&&t.submit()});$(document).on("click","#repeatRequestPayment",function(){PaymentLayer()})})