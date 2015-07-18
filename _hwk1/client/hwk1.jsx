let numTimesToSubdivide = new ReactiveVar(7);
let degrees = new ReactiveVar(45)

Template.hwk1Controls.events({
    'change .tessel, submit form, keypress .tessel': _.debounce(function(event, instance) {
        event.preventDefault()
        let newValue = parseInt(instance.$('.tessel').val())
        if (Match.test(newValue, Match.Integer))
            numTimesToSubdivide.set(newValue)
    }, 1000),

    'change .angle, submit form, keypress .angle': _.debounce(function(event, instance) {
        event.preventDefault()
        let newValue = parseFloat(instance.$('.angle').val())
        if (Match.test(newValue, Number))
            degrees.set(newValue)
    }, 1000)
})

Template.hwk1WebGL.onRendered(()=>{

    let canvas = document.getElementById( "gl-canvas" );

    let gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { throw new Error( "WebGL isn't available" ); }

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
    let vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    Tracker.autorun(function() {
        console.log('change tessel')
        points = []
        divideTriangle( vertices[0], vertices[1], vertices[2], numTimesToSubdivide.get());
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
        render();
    })

    Tracker.autorun(function() {
        console.log('change angle')
        gl.uniform1f(gl.getUniformLocation( program, "degrees" ), degrees.get())
        render();
    })

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
