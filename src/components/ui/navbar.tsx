import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./navigation-menu"

import { Button, buttonVariants } from "./button"
import { Label } from "@radix-ui/react-label"
import { NavigationMenuIndicator } from "@radix-ui/react-navigation-menu"

type NavbarProps = {
  username?: string | null
}

export function Navbar({ username }: NavbarProps) {
  return (
    <header className="w-full h-20 flex border-b-2 border-gold items-center justify-end px-8 bg-primary text-white">
      <div>
        <a href="/" className="font-semibold text-lg">
          MacFAST
        </a>
      </div>

      <div className="flex-1 flex items-center justify-end gap-2 h-full">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>My Courses</NavigationMenuTrigger>
              <NavigationMenuContent>
                    <NavigationMenuLink href="#">CHEM 1AA3</NavigationMenuLink>
                    <NavigationMenuLink href="#">COMPSCI 2GA3</NavigationMenuLink>
                    <NavigationMenuLink href="#">CHEM 1234</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink>Saved Questions</NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink href="#">My Stats</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Label>{username ?? "Logged in"}</Label>
        <Button variant="primary">Logout</Button>
      </div>
    </header>
  )
}

export default Navbar
