import { Skeleton } from "../skeleton"

interface LoadableProps {
    isLoading: boolean;
    children: React.ReactNode;
}

export default function Loadable({isLoading, children}: LoadableProps) {
    if (isLoading) {
        return <Skeleton/>
    }
    return children;
}