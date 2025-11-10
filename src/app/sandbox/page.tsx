"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Home() {
  return (

    <main>
      <div>
        <RadioGroup id="radio-group-1" >
          <RadioGroupItem value="option1" id="option1"/>
          <Label htmlFor="option1">Check me!</Label>
          <RadioGroupItem value="option2" id="option2"/>
          <Label htmlFor="option2">No, check me!</Label>
        </RadioGroup>
        
      </div>
    </main>

  );
}
