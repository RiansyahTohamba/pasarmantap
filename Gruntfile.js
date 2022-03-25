module.exports = function(grunt) {

    // Project configuration.                                                                                                                                                                
    grunt.initConfig({
        nodeunit: {
            //all : ['./test/*Test.js'], semua kelas ditest
            testProduk : ['./test/gruntProdukTest.js'],
        }
    });

    // Load nodeunit task                                                                                                                                                                
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

};

