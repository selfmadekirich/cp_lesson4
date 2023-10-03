import { InvalidOperationError } from "../src/Errors/CustomErrors";
import { InvalidArgumentError } from "../src/Errors/CustomErrors";

class MiniMaple{

   diff(polynomExpr,diffVar){
    try{
        this.#checkParams([polynomExpr,diffVar])
        const arrNodes = this.#tryParse(polynomExpr,diffVar)
        const res=[];
        
        for(const x of arrNodes){
            
            const t = x.diff()
          
            if (t != '')
             res.push(t)
        }
       
        if(res.length == 0){
            return '0'
        }
        const lastCheck = res.join("")        
        return lastCheck.startsWith("+") ? lastCheck.substring(1) : lastCheck
    }
    catch(e){
        throw e
    }
    
   }
   
   #tryParse(polynomExpr,diffVar){
    try{

        const re = /([+-]?[^-+]+)/g
        const ms = polynomExpr.match(re)
        const arrNodes = new Array()
        for (const m of ms) { 
            arrNodes.push(new ExprNode(m,diffVar))
        }
        return arrNodes

    }catch(e){
        throw e
    }

   }

   #checkParams(params){
    if(!params[0]){
        throw new InvalidArgumentError("Expr is incorrect")
    }
    if (!params[1]){
        throw new InvalidArgumentError("diff variable is incorrect")
    }
   }
   

}

class ExprNode{
    constructor(expr,diffVar){
        this.const = ''
        this.diffVar = diffVar
        this.degree = 0
        this.#tryParse(expr,diffVar)

    }
   
    #tryParse(expr){

        try{

            this.#checkExpr(expr)

            const varFirstOccur = expr.indexOf(this.diffVar)
            if (varFirstOccur == -1){
                this.const = expr
                return
            }
        
            const re = new RegExp(this.diffVar+"\\^(\\d+)","g")
            var match = re.exec(expr) 
            while(match){
                this.degree += parseInt(match[1],10)
                match = re.exec(expr) 
              }
            var newExpr = expr.replaceAll(re,'')
           
            var cycleInd = newExpr.indexOf(this.diffVar+'*')
            while (cycleInd != -1){
                this.degree++
                newExpr = newExpr.replace(this.diffVar+'*','')
                cycleInd = newExpr.indexOf(this.diffVar+'*','')
            }
           
        
            if (newExpr.indexOf('*'+this.diffVar) != -1){
                this.degree++
                newExpr = newExpr.replace('*'+this.diffVar,'')
            }


            if (newExpr.indexOf(this.diffVar) != -1){
                this.degree++
                newExpr = newExpr.replace(this.diffVar,'')
            }

            

            if(newExpr.endsWith("*"))
                newExpr = newExpr.substring(0,newExpr.length-1)
            
                
            this.const = newExpr
            
        }
        catch (e){
            throw e
        }
    }

    #checkExpr(Expr){
        const re = /\*\*|\/|%|!|&|\(|\)/g
        if (Expr.match(re) || Expr.indexOf('^'+this.diffVar) != -1){
            throw new InvalidOperationError('Invalid operation is used')
        }
    }

    #constructVarExpr(){
       
      
        if(this.degree -1 == 1)
         return "*x"
        if (this.degree > 2)
         return "*x^"+ (this.degree - 1)
    }

  
    diff(){
        if(this.degree == 0)
         return ""

        if(this.degree == 1){
            return this.const == '-' || this.const == "+" ? this.const+"1" : this.const
        }
        // proccessing values like 44*45*e*t*k*19, multiply numbers
        const re = /([+-]?\d+)/g
        var mult = 1
        
        for(const x of this.const.matchAll(re)){
            
            mult*=parseInt(x[1],10)
        }
        mult*=this.degree
        mult = this.const.startsWith("-") ? "-"+mult : "+"+mult
       

        // construct expression with variables, to get mult*e*t*k
        const symRe = /[a-z]+/g
        const arrRes = []
        
        for(const x of this.const.matchAll(symRe)){
            arrRes.push('*'+x)
        }
        // string like e*t*k
        const res = arrRes.join("")
        
        const xExpr = this.#constructVarExpr()
        this.degree--


      
        if (mult == 1){
            return res+xExpr
        }
       
        return mult + res+xExpr
        
        
    }
}

export {MiniMaple}