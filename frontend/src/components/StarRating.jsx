import ReactStars from 'react-stars';

export default function StarRating({ rating, edit, action = null, size = 22, ...props }) {
    return (
        <ReactStars
            count={5}
            value={rating}
            size={size}
            activeColor="#ffd700"
            edit={edit}
            onChange={action}
            {...props}
        />
    )
};