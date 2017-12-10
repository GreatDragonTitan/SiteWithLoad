function sleep(time, callback) {
            var stop = new Date().getTime();
            while(new Date().getTime() < stop + time) {

            }
            callback();
        }
console.log('Given data ' + process.argv[2]);
console.log('User ' + process.argv[3]);
console.log('User ' + process.argv[4]);
var pvl = 0;
for(var i =0;i<20;++i)
{
    sleep(1000,function(){

    });
    pvl = pvl+5;
    process.send({"pv":pvl})
}

var cleanExit = function() { 
    process.exit() 
};
process.on('SIGINT', cleanExit); // catch ctrl-c
process.on('SIGTERM', cleanExit); // catch kill