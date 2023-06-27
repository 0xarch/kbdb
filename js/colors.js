class HSLColor{
    h;s;l;
    constructor(h,s,l){
        this.h=h;
        this.s=s;
        this.l=l;
    }
    toRGB(){
        let h=this.h/360, s=this.s/100, l=this.l/100;
        var rgb=[];

        if(s==0){
            rgb=[Math.round(l*255),Math.round(l*255),Math.round(l*255)];
        }else{
            var q=l>=0.5?(l+s-l*s):(l*(1+s));
            var p=2*l-q;
            for(var i=0; i<rgb.length;i++){
                var tc=rgb[i];
                if(tc<0) tc+=1;
                else if(tc>1)tc-=1;
                switch(true){
                    case (tc<(1/6)):
                        tc=p+(q-p)*6*tc;
                        break;
                    case ((1/6)<=tc && tc<0.5):
                        tc=q;
                        break;
                    case (0.5<=tc && tc<(2/3)):
                        tc=p+(q-p)*(4-6*tc);
                        break;
                    default:
                        tc=p;
                        break;
                }
                rgb[i]=Math.round(tc*255);
            }
        }
        return new RGBColor(rgb[0], rgb[1], rgb[2]);
    }
    Hue(h){
        if(h<0) h=0;
        else if(h>360) h=360;
        return new HSLColor(h,this.s,this.l);
    }
    Saturation(s){
        if (s<0) s=0;
        else if (s>100) s=100;
        return new HSLColor(this.h,s,this.l);
    }
    Light(l){
        if (l<0) l=0;
        else if (l>100) l=100; 
        return new HSLColor(this.h,this.s,l);
    }
    justifyHue(dh){
        let h = this.h+dh;
        this.Hue(h);
    }
    justifySaturation(ds){
        let s = this.s+ds;
        this.Saturation(s);
    }
    justifyLight(dl){
        let l = this.l+dl;
        this.Light(l);
    }
    toCSS(){
        return `hsl(${this.h},${this.s}%,${this.l}%)`;
    }
    extract(){
        return {H:this.h,S:this.s,L:this,l};
    }
    textColor(){
        if (this.l>65) return "#000"
        else return "#fff"
    }
}
class RGBColor{
    r;g;b;
    constructor(r,g,b){
        this.r=r;
        this.g=g;
        this.b=b;
    }
    toHSL(){
        let r = this.r / 255, g = this.g / 255, b = this.b / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max == min) {
          h = s = 0; // achromatic
        } else {
          let d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return new HSLColor(h,s,l);
    }
    toCSS(){
        return `rgb(${this.r},${this.g},${this.b})`;
    }
    extract(){
        return {R:this.r,G:this.g,B:this.b};
    }
}