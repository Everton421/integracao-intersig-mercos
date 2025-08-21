export  function  delay(ms: number) {
        return new Promise(resolve => {
             console.log('Aguardando...'); 
            setTimeout(resolve, ms) 
        });
    }