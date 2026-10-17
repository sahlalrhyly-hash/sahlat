import { Link } from 'react-router-dom'
import { Heart, MapPin, BedDouble, Bath, Maximize } from 'lucide-react'
import { Property } from '@/types'
import { formatPrice } from '@/lib/utils'
import { usePropertyStore } from '@/store/propertyStore'

interface Props {
  property: Property
}

export default function PropertyCard({ property }: Props) {
  const { favorites, toggleFavorite } = usePropertyStore()
  const isFavorite = favorites.includes(property.id)

  const typeLabels: Record<string, string> = {
    apartment: 'شقة', villa: 'فيلا', land: 'أرض', office: 'مكتب', shop: 'محل',
  }
  const purposeLabels: Record<string, string> = {
    sale: 'للبيع', rent: 'للإيجار',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
      <Link to={`/property/${property.id}`} className="block">
        <div className="relative h-48">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              {typeLabels[property.type]}
            </span>
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              {purposeLabels[property.purpose]}
            </span>
          </div>
        </div>
      </Link>
      <div className="p-3">
        <div className="flex items-start justify-between">
          <Link to={`/property/${property.id}`} className="flex-1">
            <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{property.title}</h3>
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite(property.id) }}
            className="p-1 mr-2"
          >
            <Heart
              size={20}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-300'}
            />
          </button>
        </div>
        <div className="flex items-center gap-1 mt-1 text-slate-500 text-xs">
          <MapPin size={12} />
          <span>{property.district}، {property.city}</span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-slate-600 text-xs">
          {property.rooms > 0 && (
            <span className="flex items-center gap-1"><BedDouble size={14} /> {property.rooms}</span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1"><Bath size={14} /> {property.bathrooms}</span>
          )}
          <span className="flex items-center gap-1"><Maximize size={14} /> {property.area} م²</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100">
          <span className="text-primary-600 font-bold text-lg">
            {formatPrice(property.price)}
          </span>
          {property.purpose === 'rent' && <span className="text-slate-400 text-xs mr-1">/شهرياً</span>}
        </div>
      </div>
    </div>
  )
}