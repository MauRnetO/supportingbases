import React, { useState } from 'react';
import { Star, User, Calendar, MessageSquare, Filter, Eye, EyeOff } from 'lucide-react';
import { ClientReview } from '../../types';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ClientReview[]>(() => {
    return JSON.parse(localStorage.getItem('clientReviews') || '[]').map((review: any) => ({
      ...review,
      date: new Date(review.date)
    }));
  });

  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);

  const clients = JSON.parse(localStorage.getItem('mockClients') || '[]');
  const services = JSON.parse(localStorage.getItem('mockServices') || '[]');

  const filteredReviews = reviews.filter(review => {
    const matchesVisibility = filter === 'all' || 
      (filter === 'public' && review.isPublic) || 
      (filter === 'private' && !review.isPublic);
    
    const matchesRating = ratingFilter === 0 || review.rating === ratingFilter;
    
    return matchesVisibility && matchesRating;
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  const toggleReviewVisibility = (reviewId: string) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId ? { ...review, isPublic: !review.isPublic } : review
    );
    setReviews(updatedReviews);
    localStorage.setItem('clientReviews', JSON.stringify(updatedReviews));
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Avaliações dos Clientes</h3>
          <p className="text-sm text-gray-500">
            {reviews.length} avaliações • Média: {averageRating.toFixed(1)} estrelas
          </p>
        </div>
      </div>

      {/* Resumo das Avaliações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Média Geral */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(averageRating), 'lg')}
            <p className="text-sm text-gray-600 mt-2">
              Baseado em {reviews.length} avaliações
            </p>
          </div>

          {/* Distribuição por Estrelas */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'public' | 'private')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas</option>
              <option value="public">Públicas</option>
              <option value="private">Privadas</option>
            </select>
            
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={0}>Todas as estrelas</option>
              <option value={5}>5 estrelas</option>
              <option value={4}>4 estrelas</option>
              <option value={3}>3 estrelas</option>
              <option value={2}>2 estrelas</option>
              <option value={1}>1 estrela</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredReviews.length} de {reviews.length} avaliações
          </div>
        </div>
      </div>

      {/* Lista de Avaliações */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {reviews.length === 0 ? 'Nenhuma avaliação ainda' : 'Nenhuma avaliação encontrada'}
            </h4>
            <p className="text-gray-500">
              {reviews.length === 0 
                ? 'Quando clientes avaliarem seus serviços, as avaliações aparecerão aqui.'
                : 'Tente ajustar os filtros para ver mais avaliações.'
              }
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const client = clients.find((c: any) => c.id === review.clientId);
            const service = services.find((s: any) => s.id === review.serviceId);
            
            return (
              <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{client?.name || 'Cliente não encontrado'}</h4>
                      <p className="text-sm text-gray-500">{service?.name || 'Serviço não encontrado'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleReviewVisibility(review.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        review.isPublic 
                          ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                          : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                      }`}
                      title={review.isPublic ? 'Avaliação pública' : 'Avaliação privada'}
                    >
                      {review.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {review.date.toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 text-sm leading-relaxed">{review.feedback}</p>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    review.isPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {review.isPublic ? 'Pública' : 'Privada'}
                  </span>
                  
                  <div className="text-xs text-gray-500">
                    Agendamento #{review.appointmentId.slice(-4)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}