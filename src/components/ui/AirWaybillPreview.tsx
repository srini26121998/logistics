import React from 'react';

interface AwbDetails {
  cnNo: string;
  cnDate: string;
  flight: string;
  origin: string;
  dest: string;
  nop: number;
  chWt: number;
  rate: number;
  freight: number;
  otherCharges: number;
}

interface AirWaybillPreviewProps {
  awb: AwbDetails;
}

export default function AirWaybillPreview({ awb }: AirWaybillPreviewProps) {
  const currentFullDate = new Date().toLocaleDateString('en-GB');

  return (
    <div className="bg-white text-black font-sans text-[10px] sm:text-xs leading-tight w-full max-w-[800px] mx-auto border border-black p-0 shadow-lg">
      <div className="flex justify-between items-end p-2 border-b border-black text-[9px] sm:text-[10px] font-bold">
        <div>{awb.cnNo.replace('-', '|')}</div>
        <div>Final Copy: Updated on {awb.cnDate} Printed on {currentFullDate} {awb.cnNo}</div>
      </div>
      
      <div className="flex border-b border-black">
        {/* Left Column */}
        <div className="w-1/2 border-r border-black flex flex-col">
          <div className="h-28 border-b border-black flex">
            <div className="w-2/3 p-1 border-r border-black flex flex-col">
              <span className="font-bold mb-1">Shipper's Name and Address</span>
              <span className="uppercase leading-tight font-medium">
                svl cargo<br/>
                No. 28, 22nd Street, Thillai Ganga Nagar,<br/>
                Nanganallur<br/>
                CHENNAI, TAMIL NADU 600061<br/>
                INDIA<br/>
                9178829451
              </span>
            </div>
            <div className="w-1/3 p-1">
              <span className="font-bold">Shipper's Account Number</span>
            </div>
          </div>
          <div className="h-28 flex">
            <div className="w-2/3 p-1 border-r border-black flex flex-col">
              <span className="font-bold mb-1">Consignee's Name and Address</span>
              <span className="uppercase leading-tight font-medium">
                OXEN logistics<br/>
                APT ROAD<br/>
                {awb.dest}, 00 0<br/>
                INDIA<br/>
                707755362
              </span>
            </div>
            <div className="w-1/3 p-1">
              <span className="font-bold">Consignee's Account Number</span>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="w-1/2 flex flex-col">
          <div className="p-1 border-b border-black flex justify-between h-20">
            <div>
              <div className="font-bold">Not negotiable</div>
              <div className="font-bold text-sm">Air Waybill</div>
              <div>(AIR CONSIGNMENT NOTE)</div>
              <div className="mt-2 font-bold">Issued by</div>
              <div className="font-bold">InterGlobe Aviation Limited</div>
            </div>
            <div className="bg-white text-slate-900 px-2 py-4 flex items-center justify-center font-bold text-sm h-12 mt-2">
              IndiGo
            </div>
          </div>
          <div className="p-1 text-[8px] sm:text-[9px] leading-tight">
            Copies 1,2 and 3 of this Air Waybill are originals and have the same validity<br/><br/>
            It is agreed that the goods described herein are accepted in apparent good order and condition (except as noted) for carriage subject to the condition of contract on the reverse hereof. The shipper's attention is drawn to the notice concerning carrier's limitation of liability. In the event of non-declaration of the value of goods. The carrier's liability under any circumstances would not exceed INR 450/- per kilogram of goods. Shipper may increase such limitation of liability by declaring the actual value in case it exceeds INR 450/- per kilogram and pay a supplemental charge, therefore.
            <ul className="list-disc pl-3 mt-1">
              <li>This AWB is not a tax invoice</li>
              <li>Amount of freight mentioned here is as per published rate and does not represent the transaction value for GST purpose.</li>
              <li>This is for information only and the Invoice on the basis of the transaction value as per the agreement shall be issued separately.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="flex border-b border-black">
        <div className="w-1/2 border-r border-black flex flex-col">
          <div className="p-1 border-b border-black">
            <div className="font-bold">Issuing Carrier's Agent Name and City</div>
            <div className="font-bold uppercase mt-1">MAA CARGO LOGISTICS CHENNAI</div>
          </div>
          <div className="flex p-1">
            <div className="w-1/2">
              <div className="font-bold">Agent's IATA Code</div>
            </div>
            <div className="w-1/2 border-l border-black pl-1">
              <div className="font-bold">Account No.</div>
            </div>
          </div>
        </div>
        <div className="w-1/2 p-1">
          <div className="font-bold">Accounting Information</div>
        </div>
      </div>

      {/* Row 4 */}
      <div className="flex border-b border-black">
        <div className="w-1/2 border-r border-black p-1">
          <div className="font-bold">Airport of Departure (Addr. of first Carrier) and requested routing</div>
          <div className="font-bold uppercase">{awb.origin}-{awb.origin === 'MAA' ? 'CHENNAI' : awb.origin === 'DEL' ? 'DELHI' : awb.origin}</div>
        </div>
        <div className="w-1/2 flex items-center p-1 font-bold">
          {/* Empty or specific accounting details if any */}
        </div>
      </div>

      {/* Row 5 - Routing & Chgs */}
      <div className="flex border-b border-black text-center font-bold">
        <div className="w-[10%] p-1 border-r border-black">To<br/>{awb.dest}</div>
        <div className="w-[10%] p-1 border-r border-black">By first<br/>Carrier<br/>{awb.flight.split('-')[0]}</div>
        <div className="w-[20%] p-1 border-r border-black relative">Routing and Destination</div>
        <div className="w-[5%] p-1 border-r border-black">To<br/>{awb.dest}</div>
        <div className="w-[5%] p-1 border-r border-black">By<br/>{awb.flight.split('-')[0]}</div>
        <div className="w-[5%] p-1 border-r border-black">To</div>
        <div className="w-[5%] p-1 border-r border-black">By</div>
        <div className="w-[5%] p-1 border-r border-black">Currency<br/>INR</div>
        <div className="w-[5%] p-1 border-r border-black">Chgs<br/>Code<br/>PX</div>
        <div className="w-[10%] p-0 border-r border-black flex flex-col">
          <div className="border-b border-black p-0.5">WT/VAL</div>
          <div className="flex flex-1">
            <div className="w-1/2 border-r border-black p-0.5 flex items-end justify-center">PPD<br/>XX</div>
            <div className="w-1/2 p-0.5 flex items-end justify-center">COLL</div>
          </div>
        </div>
        <div className="w-[10%] p-0 border-r border-black flex flex-col">
          <div className="border-b border-black p-0.5">Other</div>
          <div className="flex flex-1">
            <div className="w-1/2 border-r border-black p-0.5 flex items-end justify-center">PPD<br/>XX</div>
            <div className="w-1/2 p-0.5 flex items-end justify-center">COLL</div>
          </div>
        </div>
        <div className="w-[15%] p-1 border-r border-black">Declared Value for<br/>Carriage<br/>NVD</div>
        <div className="w-[15%] p-1">Declared Value for<br/>Customs<br/>NCV</div>
      </div>

      {/* Row 6 */}
      <div className="flex border-b border-black">
        <div className="w-1/3 border-r border-black p-1 font-bold">
          Airport of Destination<br/>{awb.dest}-{awb.dest === 'BDQ' ? 'VADODARA' : awb.dest === 'BLR' ? 'BENGALURU' : awb.dest === 'BOM' ? 'MUMBAI' : awb.dest}
        </div>
        <div className="w-1/3 border-r border-black p-1 flex items-end justify-between font-bold">
          <div className="w-full text-center relative pt-4">
             <span className="absolute top-0 left-0">Requested Flight/Date</span>
             <span>{awb.flight}</span>
             <span className="ml-4">{awb.cnDate}</span>
          </div>
        </div>
        <div className="w-1/3 p-1 font-bold">
          Amount of Insurance<br/>XXX
        </div>
      </div>

      {/* Row 7 */}
      <div className="flex border-b border-black p-1 h-12 relative">
        <div className="font-bold">Handling Information<br/>SHC: GEN:General Cargo</div>
        <div className="absolute right-2 bottom-1 border border-black px-4 py-0.5 font-bold">SCI</div>
      </div>

      {/* Table Headers */}
      <div className="flex border-b border-black text-center font-bold">
        <div className="w-[5%] p-1 border-r border-black flex flex-col justify-end">No. of<br/>Pieces<br/>RCP</div>
        <div className="w-[10%] p-1 border-r border-black flex flex-col justify-end">Gross Weight</div>
        <div className="w-[5%] p-1 border-r border-black flex flex-col justify-end">Kg/lb</div>
        <div className="w-[5%] p-1 border-r border-black flex flex-col justify-end">Rate Class</div>
        <div className="w-[10%] p-1 border-r border-black flex flex-col justify-end">Commodity Item No.</div>
        <div className="w-[10%] p-1 border-r border-black flex flex-col justify-end">Chargeable<br/>Weight</div>
        <div className="w-[10%] p-1 border-r border-black flex flex-col justify-end">Rate /<br/>Charge</div>
        <div className="w-[15%] p-1 border-r border-black flex flex-col justify-end">Total</div>
        <div className="w-[30%] p-1 text-left">Nature and Quantity of Goods<br/>(incl. Dimensions or Volume)</div>
      </div>

      {/* Table Row Content */}
      <div className="flex border-b border-black h-32">
        <div className="w-[5%] border-r border-black text-center font-bold pt-2">{awb.nop}</div>
        <div className="w-[10%] border-r border-black text-center font-bold pt-2">{awb.chWt.toFixed(2)}</div>
        <div className="w-[5%] border-r border-black text-center font-bold pt-2">K</div>
        <div className="w-[5%] border-r border-black text-center font-bold pt-2">N</div>
        <div className="w-[10%] border-r border-black text-center font-bold pt-2">GEN</div>
        <div className="w-[10%] border-r border-black text-center font-bold pt-2">{awb.chWt.toFixed(2)}</div>
        <div className="w-[10%] border-r border-black text-center font-bold pt-2">{awb.rate.toFixed(2)}</div>
        <div className="w-[15%] border-r border-black text-center font-bold pt-2">{(awb.chWt * awb.rate).toFixed(2)}</div>
        <div className="w-[30%] p-2 font-bold uppercase text-[9px] sm:text-[10px]">
          MACHINERY PARTS- SHIPMENT DOES NOT CONTAIN ANY DANGEROUS GOODS LISTED IN TABLE 4.2 OF CURRENT DGR.<br/>
          DIMS: 49.00 * 77.00 * 45.00 * 1 * Cms;
        </div>
      </div>

      {/* Table Footer */}
      <div className="flex border-b border-black">
        <div className="w-[5%] border-r border-black text-center font-bold p-1">{awb.nop}</div>
        <div className="w-[10%] border-r border-black text-center font-bold p-1">{awb.chWt.toFixed(2)}</div>
        <div className="w-[55%] border-r border-black"></div>
        <div className="w-[30%] text-left font-bold p-1">{(awb.chWt * awb.rate).toFixed(2)}</div>
      </div>

      {/* Charges Section */}
      <div className="flex border-b border-black">
        <div className="w-[45%] border-r border-black flex flex-col">
          <div className="flex text-center font-bold border-b border-black">
            <div className="w-1/3 p-1 border-r border-black relative">Prepaid<div className="absolute right-0 bottom-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-l-[5px] border-l-black border-b-[5px] border-b-transparent"></div></div>
            <div className="w-1/3 p-1 border-r border-black">Weight Charge</div>
            <div className="w-1/3 p-1 relative"><div className="absolute left-0 bottom-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-r-[5px] border-r-black border-b-[5px] border-b-transparent"></div>Collect</div>
          </div>
          <div className="flex text-center font-bold border-b border-black">
            <div className="w-1/3 p-1 border-r border-black">{(awb.chWt * awb.rate).toFixed(2)}</div>
            <div className="w-1/3 p-1 border-r border-black bg-slate-200"></div>
            <div className="w-1/3 p-1"></div>
          </div>
          <div className="flex text-center font-bold border-b border-black">
            <div className="w-1/3 p-1 border-r border-black relative bg-slate-200"><div className="absolute right-0 bottom-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-l-[5px] border-l-black border-b-[5px] border-b-transparent z-10"></div></div>
            <div className="w-1/3 p-1 border-r border-black">Valuation Charge</div>
            <div className="w-1/3 p-1 relative bg-slate-200"><div className="absolute left-0 bottom-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-r-[5px] border-r-black border-b-[5px] border-b-transparent z-10"></div></div>
          </div>
          <div className="flex text-center font-bold border-b border-black">
            <div className="w-1/3 p-1 border-r border-black">0.00</div>
            <div className="w-1/3 p-1 border-r border-black bg-slate-200"></div>
            <div className="w-1/3 p-1"></div>
          </div>
          <div className="flex text-center font-bold border-b border-black">
            <div className="w-1/3 p-1 border-r border-black relative bg-slate-200"><div className="absolute right-0 bottom-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-l-[5px] border-l-black border-b-[5px] border-b-transparent z-10"></div></div>
            <div className="w-1/3 p-1 border-r border-black">Tax</div>
            <div className="w-1/3 p-1 relative bg-slate-200"><div className="absolute left-0 bottom-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-r-[5px] border-r-black border-b-[5px] border-b-transparent z-10"></div></div>
          </div>
          <div className="flex text-center font-bold border-b border-black">
            <div className="w-1/3 p-1 border-r border-black">0.00</div>
            <div className="w-1/3 p-1 border-r border-black bg-slate-200"></div>
            <div className="w-1/3 p-1"></div>
          </div>
          <div className="flex text-center font-bold border-b border-black">
            <div className="w-1/3 p-1 border-r border-black relative bg-slate-200"><div className="absolute right-0 bottom-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-l-[5px] border-l-black border-b-[5px] border-b-transparent z-10"></div></div>
            <div className="w-1/3 p-1 border-r border-black text-[9px]">Total other Charges Due Agent</div>
            <div className="w-1/3 p-1 relative bg-slate-200"><div className="absolute left-0 bottom-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-r-[5px] border-r-black border-b-[5px] border-b-transparent z-10"></div></div>
          </div>
          <div className="flex text-center font-bold border-b border-black">
            <div className="w-1/3 p-1 border-r border-black">500.00</div>
            <div className="w-1/3 p-1 border-r border-black bg-slate-200"></div>
            <div className="w-1/3 p-1"></div>
          </div>
          <div className="flex text-center font-bold border-b border-black">
            <div className="w-1/3 p-1 border-r border-black relative bg-slate-200"><div className="absolute right-0 bottom-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-l-[5px] border-l-black border-b-[5px] border-b-transparent z-10"></div></div>
            <div className="w-1/3 p-1 border-r border-black text-[9px]">Total other Charges Due Carrier</div>
            <div className="w-1/3 p-1 relative bg-slate-200"><div className="absolute left-0 bottom-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-r-[5px] border-r-black border-b-[5px] border-b-transparent z-10"></div></div>
          </div>
          <div className="flex text-center font-bold border-b border-black">
            <div className="w-1/3 p-1 border-r border-black">{(awb.otherCharges - 500).toFixed(2)}</div>
            <div className="w-1/3 p-1 border-r border-black bg-slate-200"></div>
            <div className="w-1/3 p-1"></div>
          </div>
        </div>
        <div className="w-[55%] flex flex-col border-black">
          <div className="p-1 font-bold">
            Other Charges<br/>
            AA/AWB FEES DUE AGENT : 500.00AC/AWB FEES DUE CARRIER : 300.00AD/ADMINISTRATIVE CHARGES : 117.00DO/DELIVERY ORDER CHARGES : 150.00FS/Fuel Surcharge : 156.00HQ/Outbound Handling Charges : 150.00TO/OUTBOUND TERMINAL STORAGE PROCESSING CHARGES : 110.00XS/X-RAY SCREENING CHARGES : 120.00XY/X-RAY CHARGES : 150.00
          </div>
          <div className="mt-auto border-t border-black p-1 text-[8px] sm:text-[9px] leading-tight">
            The shipper certifies that the particulars on the face hereof are correct and, agrees to the CONDITIONS ON THE REVERSE HEREOF, accepts the carrier's liability is limited as stated on the reverse hereof and accepts such value unless a higher value for carriage is declared on the face of hereof subject to an additional charge and that insofar as any part of the consignment contains dangerous goods(hazardous materials) such part is properly described by name and is in proper condition for carriage by air according to applicable national government regulations and for international shipments, the current International Air Transport Association's Dangerous Goods Regulations.
          </div>
          <div className="border-t border-black p-1 text-center font-bold uppercase mt-2">
            MAA CARGO LOGISTICS CHENNAI<br/>
            Signature of Shipper or his Agent
          </div>
        </div>
      </div>

      {/* Final Totals Row */}
      <div className="flex border-b border-black">
        <div className="w-[45%] border-r border-black flex flex-col">
          <div className="flex text-center font-bold border-b border-black">
             <div className="w-1/2 p-1 border-r border-black relative bg-slate-200"><div className="absolute right-0 bottom-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-l-[5px] border-l-black border-b-[5px] border-b-transparent z-10"></div></div>
             <div className="w-1/2 p-1 border-r border-black font-bold">Total Prepaid</div>
             <div className="w-1/2 p-1 relative bg-slate-200"><div className="absolute left-0 bottom-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-r-[5px] border-r-black border-b-[5px] border-b-transparent z-10"></div></div>
             <div className="w-1/2 p-1 border-r border-black font-bold">Total Collect</div>
          </div>
          <div className="flex text-center font-bold border-b border-black">
            <div className="w-1/2 p-1 border-r border-black">{(awb.freight + awb.otherCharges).toFixed(2)}</div>
            <div className="w-1/2 p-1 border-r border-black bg-slate-200"></div>
          </div>
          <div className="flex text-center font-bold border-b border-black">
             <div className="w-1/2 p-1 border-r border-black font-bold text-[9px] bg-slate-200">Currency Conversion Rates</div>
             <div className="w-1/2 p-1 border-r border-black font-bold text-[9px] relative"><div className="absolute left-0 bottom-[-5px] w-0 h-0 border-t-[5px] border-t-transparent border-r-[5px] border-r-black border-b-[5px] border-b-transparent z-10"></div>Total Collect in Dest. Currency</div>
          </div>
          <div className="flex text-center font-bold">
            <div className="w-1/2 p-1 border-r border-black bg-slate-200"></div>
            <div className="w-1/2 p-1 border-r border-black"></div>
          </div>
        </div>
        <div className="w-[55%] flex text-center font-bold p-1 items-end justify-between px-4 pb-2">
           <div className="flex flex-col items-center">
             <span>{awb.cnDate} 02:49 MAA</span>
             <span className="border-t border-black w-full text-center">EXECUTED ON (Place)</span>
           </div>
           <div className="flex flex-col items-center">
             <span>K Saikumar</span>
             <span className="border-t border-black w-full text-center">Signature of Issuing Carrier or its Agent</span>
           </div>
        </div>
      </div>
      
      {/* Bottom Row */}
      <div className="flex">
        <div className="w-[45%] border-r border-black flex">
          <div className="w-1/2 border-r border-black font-bold p-2 text-center pt-4">For Carrier Use only at Destination</div>
          <div className="w-1/2 flex flex-col">
            <div className="border-b border-black p-1 text-center font-bold bg-slate-200">Charges at Destination</div>
            <div className="flex-1"></div>
          </div>
        </div>
        <div className="w-[55%] flex items-center justify-between p-2">
          <div className="font-bold w-1/2 text-center bg-slate-200 py-1">Total Collect Charges</div>
          <div className="font-bold text-lg">{awb.cnNo}</div>
        </div>
      </div>
    </div>
  );
}
