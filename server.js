const grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("product.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);

const productPackage = grpcObject.product;

const products = [];

function createProduct(call, callback) {
    const data = call.request;

    const newProductData = { ...data, id: products.length + 1 };

    products.push(newProductData);

    callback(null, newProductData);
}

function readProduct(call, callback){
    const productId = call.request.id;
    const selectedProduct = products.find(product => product.id === productId);

    if(selectedProduct){
        callback(null, selectedProduct);
    }else {
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Could not find a product with the specified ID"
        });
    }
}

function readProducts(call, callback){
    callback(null, { products });
}

function updateProduct(call, callback){
    const productInfo = call.request;

    const productIndex = products.findIndex(product => product.id === productInfo.id);

    if(!productIndex){
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Could not find a product with the specified ID to update"
        });
    }

    const selectedProduct = products[productIndex];
    
    const updatedProduct = {
        id: selectedProduct.id,
        name: productInfo.name ?? selectedProduct.name,
        description: productInfo.description ?? selectedProduct.description,
        price: productInfo.price ?? selectedProduct.price,
        category: productInfo.category ?? selectedProduct.category,
    }
    
    products.splice(productIndex, 1, updatedProduct);
    
    callback(null, updatedProduct);
}

function deleteProduct(call, callback){
    const productId = call.request.id;
    const productIndex = products.findIndex(product => product.id === productId);
    if(!productIndex){
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Could not find a product with the specified ID to delete"
        });
    }

    products.splice(productIndex, 1);

    callback(null, { deleted: true });
}


const server = new grpc.Server();
server.addService(productPackage.Product.service, {
    createProduct,
    readProduct,
    readProducts,
    updateProduct,
    deleteProduct,
});

server.bindAsync("0.0.0.0:4000", grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log("Server Started!!!");
});
