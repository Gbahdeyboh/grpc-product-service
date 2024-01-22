const grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("product.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);

const productPackage = grpcObject.productPackage;

function createProduct(call, callback) {

}

function readProduct(call, callback){

}

function readProducts(call, callback){
    
}

function updateProduct(call, callback){
    
}

function deleteProduct(call, callback){
    
}


(function(){
    const server = new grpc.Server();
    server.addService(productPackage.Todo.service, {
        createProduct,
        readProduct,
        readProducts,
        updateProduct,
        deleteProduct,
    });

    server.bindAsync("0.0.0.0:5000", grpc.ServerCredentials.createInsecure(), () => {
        server.start();
    });
})();