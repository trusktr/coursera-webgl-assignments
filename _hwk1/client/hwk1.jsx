
Template.hwk1.onRendered(()=>{
    console.log('Hello WebGl!')

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

    // define some vertices
    let vertices = new Float32Array([
        0, -0.9,
        0.5, 0.9,
        0.9, -0.9,
        -0.9, -0.5,
        0, 0.9,
        -0.4, -0.9
    ]);

    // Load the first set of vertices into the GPU
    let bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // render the first vertices.
    render();

    function render() {
        gl.clear( gl.COLOR_BUFFER_BIT );
        gl.drawArrays( gl.TRIANGLES, 0, 6 );
    }
})
