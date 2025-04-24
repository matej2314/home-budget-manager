import ReactStars from 'react-stars';

type StarRatingProps = {
    rating: number;
    edit: boolean;
    action?: (newRating: number) => void;
    size: number;
}

export default function StarRating({ rating, edit, action = () => {}, size = 22, ...props }: StarRatingProps) {
    return (
        <ReactStars
            count={5}
            value={rating}
            size={size}
            edit={edit}
            onChange={action}
            color2="#ffd700"
            {...props}
        />
    )
};