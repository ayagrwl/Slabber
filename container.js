const dependable = require('dependable');
const path = require('path')

const container = dependable.container();

const simpleDependencies = [
    ["_","lodash"],
    ['async','async'],
    ['passport','passport'],
    
]

simpleDependencies.forEach(function(val){
    container.register(val[0],function(){
        return require(val[1]);
    })
});

container.load(path.join(__dirname,'/controllers'));
container.load(path.join(__dirname,'/helpers'));
console.log(container)

container.register('container',function(){
    return container;
});


module.exports = container;


console.log(container)