import ReactStars from 'react-rating-stars-component';

export default function StarRating({ rating, edit, action }) {
    return (
        <ReactStars
            count={5}
            value={rating}
            size={22}
            activeColor="#ffd700"
            edit={edit}
            onChange={action ? action : null}
        />
    )
};