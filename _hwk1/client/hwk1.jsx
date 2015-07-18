
Template.hwk1.onRendered(()=>{

    let canvas = document.getElementById( "gl-canvas" );

    let gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { throw new Error( "WebGL isn't available" ); }

    canvas.style.width = '100%'
    canvas.style.height = '100%'

    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio
    gl.viewport( 0, 0, canvas.width, canvas.height );

    window.requestAnimationFrame(function loop() {
        if (
            canvas.width !== canvas.clientWidth * window.devicePixelRatio ||
            canvas.height !== canvas.clientHeight * window.devicePixelRatio
        ) {
            canvas.width = canvas.clientWidth * window.devicePixelRatio
            canvas.height = canvas.clientHeight * window.devicePixelRatio
            gl.viewport( 0, 0, canvas.width, canvas.height );
        }
        render()
        window.requestAnimationFrame(loop)
    })


    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    let points = [];
    let NumTimesToSubdivide = 5;
    let vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    divideTriangle( vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();

    function render() {
        gl.clear( gl.COLOR_BUFFER_BIT );
        gl.drawArrays( gl.TRIANGLES, 0, points.length );
    }

    function triangle( a, b, c ) {
        points.push( a, b, c );
    }

    function divideTriangle( a, b, c, count ) {

        // check for end of recursion

        if ( count === 0 ) {
            triangle( a, b, c );
        }
        else {

            //bisect the sides

            var ab = mix( a, b, 0.5 );
            var ac = mix( a, c, 0.5 );
            var bc = mix( b, c, 0.5 );

            --count;

            // three new triangles

            divideTriangle( a, ab, ac, count );
            divideTriangle( c, ac, bc, count );
            divideTriangle( b, bc, ab, count );
        }
    }
})
