template Temp() {
   signal input n1;
   signal input n2;
   signal input n3;
   signal output o1;

   o1 <== (n1 + n2) * n3;
}
component main{public [n3]} = Temp();
