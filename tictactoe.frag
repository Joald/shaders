// Author @patriciogv - 2015

#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359
uniform vec2 u_resolution;
uniform float u_time;
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
float circle(in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.02),
                         _radius+(_radius*0.02),
                         dot(l,l)*4.0);
} 

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float cross(in vec2 _st, float _size){
    _st -= 0.5;
    _st = rotate2d(PI / 4.) * _st;
    _st += 0.5;
    return  box(_st, vec2(_size,_size/4.)) +
            box(_st, vec2(_size/4.,_size));
}

vec2 multi_space(inout vec2 st, in float x, in float y) {
    vec2 orig = st *= vec2(x, y);
    st = fract(st);
    return orig;
}

float set(in vec2 orig, in float x, in float y) {
    vec2 bound = step(vec2(x, y), orig);
    bound *= step(orig, vec2(x + 1., y + 1.));
    return min(bound.x, bound.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0); 
    
    vec2 orig = multi_space(st, 3., 3.);
    float bound = set(orig, 1., 1.);
    bound += set(orig, 2., 2.);
    bound += set(orig, 0., 1.);
    bound += set(orig, 1., 0.);
    bound += set(orig, 2., 0.);
    
    float cros = set(orig, 0.0, 0.);
    cros += set(orig, 0., 2.);
    cros += set(orig, 2., 1.);
    cros += set(orig, 1., 2.);
    color += vec3(circle(st, 0.5)) * bound;
    color += vec3(cross(st, 0.7)) * (cros);

	gl_FragColor = vec4(color,1.0);
}

