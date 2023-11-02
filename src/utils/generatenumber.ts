
const generateNumber = (kode:number) => {
    let kode_gen = 1

    let kode_hasil : number = 0

  if(kode === null ) {
    kode_hasil  = 1
  }

  else {
    kode_hasil = kode + 1
  }

  // console.log("TES UTILS => ", kode_hasil)

  return kode_hasil
}

export default {generateNumber}