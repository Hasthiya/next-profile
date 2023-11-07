"use client"

import {Button} from "@/components/ui/button";

const Nav = () => {
    return (
        <header>
            <nav>
                <div className= "p-5">
                <Button className="mr-2">{"Shadcn button"}</Button>
                <Button>{"Detonate button"}</Button>
                <Button variant="outline">Button</Button>
                </div>
            </nav>
        </header>
    );
};

export default Nav;